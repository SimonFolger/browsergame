import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'silverGoldString'
})
export class SilverGoldStringPipe implements PipeTransform {

  transform(silver: number): string {
    let silverResult = silver % 100;
    let goldResult = Math.floor(silver / 100);
    return goldResult + " Gold and " + silverResult + " Silver";
  }

}
