import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RemoveATagsService {

  removeATags(htmlContent: string, cut: number): string {
    const sanitizedContent = htmlContent || '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedContent;

    const anchorElements = tempDiv.getElementsByTagName('a');
    for (let i = anchorElements.length - 1; i >= 0; i--) {
      const anchorElement = anchorElements[i];
      const spanElement = document.createElement('span');
      spanElement.innerText = anchorElement.innerText;
      anchorElement.parentNode?.replaceChild(spanElement, anchorElement);
    }

    if(cut > 0) {
      const words = tempDiv.innerHTML.split(' ').slice(0, cut);
      return words.join(' ') + " ...";
    }

    return tempDiv.innerHTML;
}
}
