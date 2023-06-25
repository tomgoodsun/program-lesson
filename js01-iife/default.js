// ※一部GitHub Copilotによる解説に頼っています。

// 即時実行関数式
// Immediately Invoked Function Expression
// @see https://developer.mozilla.org/ja/docs/Glossary/IIFE
// 関数の定義と同時に実行する関数式の書き方のこと。

// 通常の関数定義
//
// function キーワードで関数を定義して、後で定義した識別子で呼び出す。
// これを「関数宣言」といったりする。
function func1() {
  console.log('func1');
}
func1();

// あるいは、関数式を変数に代入して、変数名で呼び出す方法がある。
// これを「関数リテラル」、あるいは「関数式」といったりする。
const func2 = function () {
  console.log('func2');
};
func2();

// この2つの違いは何なのか。
// それは、関数宣言は関数の定義が行われる前に呼び出すことができるが、
// 関数式は関数の定義が行われる前に呼び出すことができないということ。
// つまり、関数式は関数の定義が行われる前に呼び出すことができない。
// これを「巻き上げ」という。
// 例えば、以下のようなコードはエラーになる。
try {
  func3(); // Uncaught TypeError: func3 is not a function
  const func3 = function () {
    console.log('func3');
  };
} catch (e) {
  console.error(e);
}

// JavaScriptの関数はFunctionオブジェクトというオブジェクトの一種である。
// そのため、関数もオブジェクトの一種である。
// そのため、関数を変数に代入することができる。
// このような関数を変数に代入することを「関数式」という。
// 「式」は結果を変数などに代入しなくても別に構わない。
// 例えば、以下のようなコードはエラーにならない。
console.log(1 + 1); // 2

// 「1 + 1」は式だが、その結果を変数に代入していないが、その結果はちゃんと評価され、実行され、エラーにもならない。

// 関数宣言の場合はfunctionキーワードで必ず宣言する必要があるが、関数リテラルの場合は代入「式」になっている。
// 前述の解説のとおりだとその場で評価・実行ができるということになる。

(function () {
  console.log('func4');
})();

// このように、関数式を()で囲んで、その後ろに()をつけることで、関数式を即時実行することができる。
// この()は、いわゆる優先順位を変えるための()である。
// このとき、最初の()で囲んだ関数を無名関数、または匿名関数という。（anonymous function, nameless function）
// この特徴を利用して、即時関数を実行する式を「即時実行関数式」という。

// なぜ実装が必要なのか。
// これは、JavaScriptのスコープの仕様に関係している。
// 通常、関数内で定義された変数は、その関数内でのみ有効である。
// 例えば、以下のようなコードはエラーになる。
try {
  function func5() {
    const x = 1;
  }
  console.log(x); // Uncaught ReferenceError: x is not defined
} catch (e) {
  console.error(e);
}

// これは、関数内で定義された変数は、その関数内でのみ有効であるため、関数外からは参照できないためである。

// いろいろなプログラムを組み合わせて使う場合、関数名・変数名が重複し、衝突してしまうことがある。
// これは意図しない動作を引き起こし、致命的なバグを生むことになる。
// そのため、自分で作るプログラムに関しては関数内に閉じ込めておくことで、
// 他のプログラムからの影響を受けないように、あるいは影響しないようにすることができる。
// 書き方は色々あるが、以下のような書き方が一般的である。
(function (window, document) {
  // ここにプログラムを書く
})(window, window.document);

// あるいはjQueryを使う場合に関数の引数でjQueryを参照することができる。
// 以下は第3引数にjQueryもしくはjQueryよりも軽量とされるZepotというライブラリを渡している。
(function (window, document, $) {
  // ここにプログラムを書く
})(window, window.document, window.jQuery || window.Zepto);

// 関数の書き方には、functionキーワードを使わないものもある。
// これはアロー関数と呼ばれるものである。
// @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions

// 以下のように書くことができる。
(() => {
  console.log('func6');
})();
