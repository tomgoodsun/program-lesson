// ※GitHub Copilotによる解説に頼っています。

// 継承とプロトタイプチェーン
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

// オブジェクト指向プログラミングのデザインパターンに、Prototypeパターンがあるが、JavaScriptでいうPrototypeは、それとは異なる。
// JavaScriptでオブジェクトの継承関係を実装するためにはプロトタイプチェーンを理解する必要がある。
// 以下はMDNからの引用。
const o = {
  a: 1,
  b: 2,
  // __proto__ は [[Prototype]] を設定します。ここでは
  // 他のオブジェクトリテラルとして指定します。
  __proto__: {
    b: 3,
    c: 4,
    __proto__: {
      d: 5,
    },
  },
};
// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> { d: 5 } ---> Object.prototype ---> null
console.log(o.d); // 5
console.log(o.c); // 4
console.log(o.b); // 2

// このように、オブジェクトはプロパティを持つが、プロパティが存在しない場合は、そのプロパティを持つオブジェクトを探しに行く。
// この探しに行くオブジェクトのことを「プロトタイプ」という。
// このプロトタイプを辿っていくことを「プロトタイプチェーン」という。

// 次にこのプロトタイプを使って、既存のオブジェクトを拡張する方法を見ていく。
// ここでは組み込みオブジェクトであるStringオブジェクトを拡張してみる。
String.prototype.hello = function () {
  return `Hello, ${this.toString()}`;
};
console.log('World'.hello()); // Hello, World

// このように、Stringオブジェクトのプロトタイプにhelloメソッドを追加することで、Stringオブジェクトを拡張することができる。
// プロトタイプを使ってオブジェクトを拡張することを「プロトタイプベースのプログラミング」という。

// では、こういうのはどうだろう。
// 日時の取得にMySQLなどでおなじみの「%Y-%m-%d %H:%i:%s」形式で取得するという関数をJavaScriptで実装してみるとする。
// 実はこのフォーマットをカバーするメソッドが存在しておらず、この要件を満たすのは非常に面倒でいつも困っている。
// 特にゼロフィル表現が必要な、月、日、時、分、秒が非常に面倒である。
// せっかくなのでライブラリを作る気持ちで、Dateオブジェクトを拡張して作ってみよう。
Number.prototype.zeroFill = function (length) {
  return ('0'.repeat(length) + this.toString()).slice(-length);
};
Date.prototype.toMysqlFormat = function () {
  return `${this.getFullYear()}-${(this.getMonth() + 1).zeroFill(2)}-${this.getDate().zeroFill(2)}`
    + ` ${this.getHours().zeroFill(2)}:${this.getMinutes().zeroFill(2)}:${this.getSeconds().zeroFill(2)}`;
};
console.log(new Date().toMysqlFormat()); // 2021-08-22 22:22:22
console.log(new Date('2023-01-02T03:04:05+09:00').toMysqlFormat()); // 2023-01-02 03:04:05

// ただこれだとprototypeを使えばどんなものでも拡張できてしまう他、既存のメソッドを上書きしてしまう可能性がある。
Date.prototype.toMysqlFormat = function () {
  return 'Date.prototype.toMysqlFormat has been overwritten.';
};
console.log(new Date().toMysqlFormat());

// そこで、このような拡張を行う場合は、Object.definePropertyを使うことが推奨されている。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
//
// これは、プロパティの定義を行うメソッドである。
// このメソッドを使うことで、プロパティの定義を行うことができる。
// このメソッドは、以下のように使う。
Object.defineProperty(Date.prototype, 'toMysqlFormat2', {
  value: function () {
    return `${this.getFullYear()}-${(this.getMonth() + 1).zeroFill(2)}-${this.getDate().zeroFill(2)}`
      + ` ${this.getHours().zeroFill(2)}:${this.getMinutes().zeroFill(2)}:${this.getSeconds().zeroFill(2)}`;
  },
  writable: false // 上書き不可にする
});
console.log(new Date().toMysqlFormat2()); // 2021-08-22 22:22:22
console.log(new Date('2023-01-02T03:04:05+09:00').toMysqlFormat2()); // 2023-01-02 03:04:05
Date.prototype.toMysqlFormat2 = function () {
  return 'Date.prototype.toMysqlFormat2 has been overwritten.';
};
console.log(new Date().toMysqlFormat2()); // 「Date.prototype.toMysqlFormat2 has been overwritten.」と表示されない。

// まぁ現在のブラウザの実装ではconstructorやextendを使えば簡単に継承できるので、このような書き方はしなくてもいいのかもしれないが、
// 知っておくとJavaScriptのプロトタイプベースのプログラミングの理解が深まると思うのと、
// JavaScriptコンパイラの出力結果は最新実装が無いブラウザでもある程度動作するようになっているので、それらを読むときに役に立つと思う。

// ちなみに小話だが、JavaScriptライブラリを作るときにファイルの先頭に以下のような記述をすることがある。
; (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.js02Prototype = {}));
}(this, (function (exports) {
  'use strict';
  // ここにプログラムを書く
})));
// これは、このライブラリがNode.jsで動作する場合とブラウザで動作する場合で、
// それぞれの環境でライブラリを読み込む方法が異なるため、
// その環境に応じて読み込み方を変えるためのものである。
// このような記述を「UMD (Universal Module Definition)」という。
// https://qiita.com/yohei1126/items/a04770e0e41c387144b6
// あとセミコロンがポイントだったりする。
