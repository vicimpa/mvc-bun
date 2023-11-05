import { numberCount } from "core/utils/numberCount";

const symRegExp = /\$((\w)\2*)/g;

export class FDate extends Date {
  get Y() { return this.getFullYear(); }
  get M() { return this.getMonth() + 1; }
  get D() { return this.getDate(); }
  get h() { return this.getHours(); }
  get m() { return this.getMinutes(); }
  get s() { return this.getSeconds(); }
  get i() { return this.getMilliseconds(); }

  set Y(v) { this.setFullYear(v); }
  set M(v) { this.setMonth(v - 1); }
  set D(v) { this.setDate(v); }
  set h(v) { this.setHours(v); }
  set m(v) { this.setMinutes(v); }
  set s(v) { this.setSeconds(v); }
  set i(v) { this.setMilliseconds(v); }

  format(string = '$DD.$MM.$YYYY $hh:$mm:$ss') {
    return string.replace(symRegExp, (find, { length }, key) => {
      const value = (this as any)[key];

      if (typeof value === 'number')
        if (length > 1)
          return numberCount(value, length);
        else
          return `${value}`;

      return find;
    });
  }

  static makeFormat(string?: string) {
    return (input?: ConstructorParameters<typeof Date>[0]) => {
      const fdate = new this(input = Date.now());
      return fdate.format(string);
    };
  }
}