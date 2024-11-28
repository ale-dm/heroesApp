import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './newPage.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class NewPageComponent implements OnInit { 

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  public publishers = [
    { id: 'DC Comics', desc:'DC - Comics' },
    { id: 'Marvel Comics', desc:'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {};

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {
        if(!hero) return this.router.navigateByUrl('/')

          this.heroForm.reset(hero);
          return
      })
  }

  onSubmit():void {
    if(this.heroForm.invalid) return;

    if(this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe( hero => {
          this.showSnackbar(`Se ha actualizado el héroe ${hero.superhero}.`)
        });
        return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`Se ha creado el héroe ${hero.superhero}.`)
      })
    }

    onDeleteHero() {
      if (!this.currentHero.id) throw Error('Hero ID is required');
      
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      });

      dialogRef.afterClosed()
        .pipe(
          filter(result => true),
          switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
          filter((wasDeleted: boolean) => wasDeleted),
        )
        .subscribe( () => {
          this.router.navigate(['/heroes'])
        })
    }

    showSnackbar( messsage: string):void {
      this.snackbar.open(messsage, 'Ok', {
        duration: 2500
      })
    }

}

