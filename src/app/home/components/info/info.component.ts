import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../../core/model/userModel';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  loading = false;
  users: UserModel[] = [];
  displayedColumns: string[] = ['id','user','firstName','lastName'];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getAllWithOutMe().subscribe(users => {
      this.loading = false;
      this.users = [...users];
    });
  }
}
