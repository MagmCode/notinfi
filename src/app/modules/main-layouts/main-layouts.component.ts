import { Component, OnInit, Renderer2, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'main-layouts',
  templateUrl: './main-layouts.component.html',
  styleUrls: ['./main-layouts.component.scss'],
})
export class MainLayoutsComponent implements OnInit {
  isSidebarOpened = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  opened: boolean;
  events: string[] = [];
  isScreenSmall: boolean;
  navigation: Navigation;
  ifScreenSmall = window.innerWidth < 768;






  constructor(
    private _router: Router,
    private renderer: Renderer2,
    private _fuseMediaWatcherService: FuseMediaWatcherService,


  )
  {
      // this.setBodyStyles();

  }

  // setBodyStyles() {

  //     this.renderer.setStyle(document.body, 'overflow', 'hidden');
  //     this.renderer.setStyle(document.body, 'background', 'white');
  //     this.renderer.setStyle(document.body, 'height', '100vh');
  
  //     // Establece el fondo en el body (puedes cambiarlo si lo deseas)
  //     this.renderer.setStyle(
  //       document.body,
  //       'background-color',
  //       'white'
  //   );
  // }

  get currentYear(): number
    {
        return new Date().getFullYear();
    }

  ngOnInit(): void {

     // Subscribe to media changes
     this._fuseMediaWatcherService.onMediaChange$
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe(({matchingAliases}) => {

         // Check if the screen is small
         this.isScreenSmall = !matchingAliases.includes('md');
     });
  

  this.renderer.listen('document', 'keydown', (event) => {
    if (event.key === 'Escape' && this.opened) {
      this.toggleSidebar(); // Close the sidebar if it's open
    }
  });


}

  toggleSidebar(): void {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  signOut(): void
{
  this._router.navigate(['/sign-out']).then(() => {
    this.opened = false; 
});
}

inicio(): void {
     this._router.navigate(['/menu-principal']).then(() => {
        this.opened = false; 
        this.events.push('close!'); 
      });
}


}
