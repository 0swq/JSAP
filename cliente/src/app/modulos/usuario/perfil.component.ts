import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../_services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Perfil</h1><pre>{{ currentUser | json }}</pre>`,
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  constructor(private storageService: StorageService) {}
  ngOnInit(): void { this.currentUser = this.storageService.getUser(); }
}
