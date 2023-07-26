// ※一部GitHub Copilotによる解説に頼っています。

// JavaScriptのスコープは簡単に言えば関数の{}で囲まれた範囲のこと。
// また{}の中に関数{}がある場合は、内側から外側の値が参照できることがある。

let Person1 = function (firstName, lastName) {
  let _firstName = firstName;
  let _lastName = lastName;
  return {
    getFullName: function () {
      return `${_lastName} ${_firstName}`;
    }
  }
};
let person1 = new Person1('花子', '山田');
console.log(person1.getFullName()); // 山田 花子

// このように、Person関数オブジェクト内のローカル変数は、getFullName関数内から参照することができる。
// このように、関数の外側から内側の値を参照することを「クロージャー」という。
// このクロージャーは、関数の外側から内側の値を参照することができるということを意味する。
// しかし引数の変数名とローカル変数名が衝突してしまうため、
// ローカル変数名にはアンダースコアをつけるという手法が取られることがある。

// これを防ぐにはthis参照で、オブジェクトの変数にしてしまうといい。
// しかし、this参照は、関数内でのみ使用できるため、関数の外側から参照することはできない。
// 以下の例では、getFullName関数内でthisを使用しているが、関数の外側から参照することはできないため、
// person.firstNameなどとしても、undefinedとなってしまう。
let Person2 = function (firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  return {
    getFullName: function () {
      return `${this.lastName} ${this.firstName}`;
    }
  };
};
let person2 = new Person2('角栄', '田中');
console.log(person2.getFullName()); // undefined undefined

// function内のthis参照は、function内にスコープがあるため、その外を呼び出すことができない。
// ではどうするのか。
// そこで、getFullNameメソッドの中で外側のfunctionを参照できるようにthisを予め別の変数へ代入しておく。
// 変数はクロージャーの特性により、function内から外側のfunctionを参照することができる。
let Person3 = function (firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  let that = this;
  return {
    getFullName: function () {
      return `${that.lastName} ${that.firstName}`;
    }
  };
};
let person3 = new Person3('四郎', '鈴木');
console.log(person3.getFullName()); // 鈴木 四郎

// このように、thisを別の変数へ代入しておくことで、function内から外側のfunctionを参照することができる。
// このように、thisを別の変数へ代入しておくことを「バインド」という。
// このバインドを行うことで、thisを別の変数へ代入しておくことを「thisの束縛」という。
// バインドに使用される変数名には、thatやselfなどがよく使われる。
// thisと、ある意味で反対の意味であるthatというのは若干のセンスを感じる。
// しかし注意しておいてほしいのは、この連鎖は無限に続くということである。
// つまり、function内で、function内で、function内で、、、というように、無限に続き、
// thisのスコープもそれぞれ変わっていき、都度thatやselfなどに代入していく必要がある。

// できるだけ避けたいところではある。

// ES6からはアロー関数が導入された。
// アロー関数は、functionを省略することができる。
// また、thisのスコープが変わらないという特徴がある。
// このアロー関数を使用することで、thisのスコープを変えることなく、
// 外側のfunctionを参照することができる。
let Person4 = function (firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  return {
    getFullName: () => {
      return `${this.lastName} ${this.firstName}`;
    }
  };
}
let person4 = new Person4('B作', '佐藤');
console.log(person4.getFullName()); // 佐藤 B作
