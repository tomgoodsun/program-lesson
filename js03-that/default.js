// ※一部GitHub Copilotによる解説に頼っています。

// JavaScriptのスコープは簡単に言えば関数の{}で囲まれた範囲のこと。
// また{}の中に関数{}がある場合は、内側から外側の値が参照できる。

let Person = function (firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.fullName = `${this.lastName} ${this.firstName}`;
};
let person = new Person('太郎', '山田', 20);
console.log(person.fullName); // 山田 太郎

// このように、Personコンストラクターの中で定義されたfullNameプロパティは、Personコンストラクターの外からも参照できる。
// このとき変数thisがどこを指しているかというと、6行目のFunctionオブジェクトを指している。

// ではFunctionオブジェクトの中に更に関数を定義して、その中でthisを参照してみるとどうだろう。
let Person2 = function (firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  return {
    getFullName: function () {
      return `${this.lastName} ${this.firstName}`;
    }
  };
};
let person2 = new Person2('太郎', '山田', 20);
console.log(person2.getFullName()); // undefined

// function内のthis参照は、function内にスコープがあるため、その外を呼び出すことができない。
// ではどうするのか。
// そこで、getFullNameメソッドの中で外側のfunctionを参照できるようにthisを予め別の変数へ代入しておく。
let Person3 = function (firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  let that = this;
  return {
    getFullName: function () {
      return `${that.lastName} ${that.firstName}`;
    }
  };
};
let person3 = new Person3('太郎', '山田', 20);
console.log(person3.getFullName()); // 山田 太郎

// このように、thisを別の変数へ代入しておくことで、function内から外側のfunctionを参照することができる。
// このように、thisを別の変数へ代入しておくことを「バインド」という。
// このバインドを行うことで、thisを別の変数へ代入しておくことを「thisの束縛」という。
// バインドに使用される変数名には、thatやselfなどがよく使われる。
// thisと、ある意味で反対の意味であるthatというのは若干のセンスを感じる。
// しかし注意しておいてほしいのは、この連鎖は無限に続くということである。
// つまり、function内で、function内で、function内で、というように、無限に続き、thisのスコープもそれぞれ変わっていき、都度thatやselfなどに代入していく必要がある。

// できるだけ避けたいところではある。
