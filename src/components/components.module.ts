import { NgModule } from '@angular/core';
import { FooterbarComponent } from './footerbar/footerbar';
import { FloatingButtonComponent } from './floating-button/floating-button';
import { HeaderComponent } from './header/header';

@NgModule({
	declarations: [FooterbarComponent,
    FloatingButtonComponent,
    HeaderComponent],
	imports: [],
	exports: [FooterbarComponent,
    FloatingButtonComponent,
    HeaderComponent]
})
export class ComponentsModule {}
