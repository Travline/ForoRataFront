import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Copy, Heart, LucideAngularModule, MessageCircleMore } from 'lucide-angular';

@Component({
  selector: 'app-post',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input({ required: true }) post!: PostResponse | PostFocusResponse;

  readonly heart = Heart
  readonly comment = MessageCircleMore
  readonly copy = Copy
}
