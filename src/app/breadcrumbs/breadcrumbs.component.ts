import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() childBreadcumbTitle: any;
  @Input() childBreadcumbPath: any;
  constructor() { }

  ngOnInit() {
  }

}
