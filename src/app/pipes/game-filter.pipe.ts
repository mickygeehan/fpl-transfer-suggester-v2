import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gameFilter'
})
export class GameFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
