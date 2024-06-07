import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CardService } from '../admin/admin-dashboard/card.service';
import { Card } from '../admin/admin-dashboard/card.model';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit{
  cards: Card[] = [];
  currentIndex: number = 0;
  cardWidth: number = 25; // 25% for 4 cards at a time
  contactMessage: any = {
    name: '',
    email: '',
    comment: ''
  };
  successMessage: string = '';
  errorMessage: string = '';
  showButton: boolean = false;

  @ViewChild('sliderTrack', { static: false }) sliderTrack: ElementRef | null = null;

  constructor(private contactService: ContactService,private cardService: CardService,public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadCards();
    window.onscroll = () => {
      this.scrollFunction();
    };
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateSliderWidth(), 0);
  }

  sendMessage(): void {
    this.contactService.sendContactMessage(this.contactMessage).subscribe(
      response => {
        this.successMessage = 'Message sent successfully';
        this.resetForm();
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error => {
        this.errorMessage = 'Failed to send message: ' + (error.error.message || error.message);
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    );
  }

  resetForm(): void {
    this.contactMessage = {
      name: '',
      email: '',
      comment: ''
    };
  }

  loadCards() {
    this.cardService.getCards().subscribe(
      data => {
        this.cards = data;
        // Duplicate cards for infinite loop
        this.cards = [...this.cards, ...this.cards];
        setTimeout(() => this.updateSliderWidth(), 0);
      },
      error => console.error(error)
    );
  }

  updateSliderWidth() {
    if (this.sliderTrack) {
      const totalCards = this.cards.length;
      this.sliderTrack.nativeElement.style.width = `${totalCards * this.cardWidth}%`;
    }
  }

  prevSlide() {
    const sliderTrack = this.sliderTrack?.nativeElement;
    if (sliderTrack) {
      if (this.currentIndex === 0) {
        this.currentIndex = this.cards.length / 2;
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
        setTimeout(() => {
          this.currentIndex--;
          sliderTrack.style.transition = 'transform 0.5s ease-in-out';
          sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
        }, 0);
      } else {
        this.currentIndex--;
        sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
      }
    }
  }

  nextSlide() {
    const sliderTrack = this.sliderTrack?.nativeElement;
    if (sliderTrack) {
      if (this.currentIndex === this.cards.length / 2) {
        this.currentIndex = 0;
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
        setTimeout(() => {
          this.currentIndex++;
          sliderTrack.style.transition = 'transform 0.5s ease-in-out';
          sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
        }, 0);
      } else {
        this.currentIndex++;
        sliderTrack.style.transform = `translateX(-${this.currentIndex * this.cardWidth}%)`;
      }
    }
  }

  updateSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) {
      sliderTrack.style.transform = `translateX(-${this.currentIndex * (100 / 3)}%)`;
    }
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }
}
