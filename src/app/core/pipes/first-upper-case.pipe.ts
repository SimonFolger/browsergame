import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstUpperCase'
})
export class FirstUpperCasePipe implements PipeTransform {

  transform(value: string): string {
    //let firstChar = value.charAt(0);
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
