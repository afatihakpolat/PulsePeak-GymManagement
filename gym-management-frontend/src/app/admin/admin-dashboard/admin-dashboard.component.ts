import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CardService } from './card.service';
import { Card } from './card.model';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  coaches: any[] = [];
  newCoach: any = {};
  successMessage: string = '';
  errorMessage: string = '';
  currentView: string = 'users';
  selectedUserId: number | null = null;
  selectedCoach: number | null = null;
  searchTerm: string = '';
  selectedRole: string = 'USER';
  filteredUsers: any[] = [];
  contactMessages: any[] = [];
  groupedMessages: any[] = [];
  expandedEmail: string | null = null;

  // Dynamic cards
  cards: Card[] = [];
  selectedCard: Card | null = null;
  selectedCardIndex: number = -1;
  cardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private contactService: ContactService
  ) {
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCoaches();
    this.loadCards();
    this.loadContactMessages();
  }

  loadContactMessages(): void {
    this.contactService.getMessages().subscribe(
      data => {
        this.contactMessages = data;
        this.groupMessagesByEmail();
      },
      error => {
        console.error('Failed to load contact messages', error);
      }
    );
  }

  deleteMessage(messageId: number): void {
    this.contactService.deleteContactMessage(messageId).subscribe(
      () => {
        this.successMessage = 'Message deleted successfully';
        this.loadContactMessages(); // Reload messages to reflect changes
        setTimeout(() => this.successMessage = '', 3000);
      },
      error => {
        this.errorMessage = 'Failed to delete message: ' + (error.error.message || error.message);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  groupMessagesByEmail(): void {
    const grouped = this.contactMessages.reduce((acc, message) => {
      if (!acc[message.email]) {
        acc[message.email] = {
          email: message.email,
          name: message.name,
          messages: []
        };
      }
      acc[message.email].messages.push(message);
      return acc;
    }, {});

    this.groupedMessages = Object.values(grouped);
  }

  toggleExpand(email: string): void {
    this.expandedEmail = this.expandedEmail === email ? null : email;
  }

  // Methods for dynamic cards
  loadCards() {
    this.cardService.getCards().subscribe(
      data => this.cards = data,
      error => console.error(error)
    );
  }

  editCard(card: Card) {
    this.selectedCardIndex = this.cards.indexOf(card);
    this.selectedCard = { ...card };
    this.cardForm.patchValue(this.selectedCard);
  }

  addNewCard() {
    this.selectedCardIndex = -1;
    this.selectedCard = { title: '', content: '' };
    this.cardForm.reset(this.selectedCard);
  }

  saveCard() {
    if (this.cardForm.valid) {
      const cardData = this.cardForm.value;
      if (this.selectedCardIndex === -1) {
        this.cardService.createCard(cardData).subscribe(
          card => {
            this.cards.push(card);
            this.closeModal();
          },
          error => console.error(error)
        );
      } else {
        this.cardService.updateCard({ ...this.selectedCard, ...cardData }).subscribe(
          card => {
            this.cards[this.selectedCardIndex] = card;
            this.closeModal();
          },
          error => console.error(error)
        );
      }
    }
  }

  deleteCard(cardId: number | undefined) {
    if (cardId !== undefined) {
      this.cardService.deleteCard(cardId).subscribe(
        () => {
          this.cards = this.cards.filter(card => card.id !== cardId);
        },
        error => console.error(error)
      );
    }
  }

  closeModal() {
    this.selectedCard = null;
    this.selectedCardIndex = -1;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.users.forEach(user => {
          user.selectedCoach = user.coachId || null; // Initialize selectedCoach with coachId
        });
        this.filterUsers(); // Filter users initially
      },
      error => {
        console.error('Failed to load users', error);
      }
    );
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      response => {
        this.successMessage = 'User deleted successfully';
        this.loadUsers();
        this.loadCoaches();
      },
      error => {
        this.errorMessage = 'Failed to delete user: ' + (error.error.message || error.message);
      }
    );
  }

  loadCoaches(): void {
    this.userService.getAllCoaches().subscribe(
      data => {
        this.coaches = data;
      },
      error => {
        this.errorMessage = 'Failed to load coaches';
      }
    );
  }

  addCoach(): void {
    this.userService.addCoach(this.newCoach).subscribe(
      response => {
        this.successMessage = 'Coach added successfully';
        this.loadCoaches();
        this.loadUsers();
        this.newCoach = {}; // Clear form
      },
      error => {
        this.errorMessage = 'Failed to add coach: ' + (error.error.message || error.message);
      }
    );
  }

  updateCoach(coach: any): void {
    this.userService.updateCoach(coach).subscribe(
      response => {
        this.successMessage = 'Coach updated successfully';
      },
      error => {
        this.errorMessage = 'Failed to update coach: ' + (error.error.message || error.message);
      }
    );
  }

  deleteCoach(coachId: number): void {
    this.userService.deleteCoach(coachId).subscribe(
      response => {
        this.successMessage = 'Coach deleted successfully';
        this.loadCoaches();
        this.loadUsers();
      },
      error => {
        this.errorMessage = 'Failed to delete coach: ' + (error.error.message || error.message);
      }
    );
  }

  assignCoachToUser(userId: number, coachId: number | null): void {
    this.userService.assignCoachToUser(userId, coachId).subscribe(
      response => {
        this.successMessage = coachId ? 'Coach assigned successfully' : 'Coach assignment removed';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadUsers(); // Reload users to reflect changes
      },
      error => {
        this.errorMessage = 'Failed to assign coach: ' + (error.error.message || error.message);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  switchView(view: string): void {
    this.currentView = view;
    this.clearMessages(); // Clear messages when switching views
    this.loadUsers();
    this.loadCoaches();
    this.loadCards();
    this.loadContactMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearchTerm = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.selectedRole ? user.role === this.selectedRole : true;
      return matchesSearchTerm && matchesRole;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/homepage']);
  }
}
