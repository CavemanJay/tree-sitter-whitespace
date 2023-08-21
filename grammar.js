module.exports = grammar({
  name: 'whitespace',
  extras: $ => [
    // $.comment,
    /[^ \t\n]/,
  ],
  rules: {
    source_file: $ => repeat($._op),
    _op: $ => choice(
      $.op_io,
      $.op_arithmetic,
      $.op_flow,
      $.op_heap,
      $.op_stack
    ),

    _S: $ => ' ',
    _L: $ => '\n',
    _T: $ => '\t',

    S: $ => ' ',
    L: $ => '\n',
    T: $ => '\t',

    // S: $ => 'S',
    // L: $ => 'L',
    // T: $ => 'T',

    comment: $ => /\w/,

    _imp_io: $ => seq($._T, $._L),
    _imp_stack: $ => $._S,
    _imp_arithmetic: $ => seq($._T, $._S),
    _imp_flow: $ => $._L,
    _imp_heap: $ => seq($._T, $._T),

    read_char: $ => seq($._imp_io, $._T, $._S),
    read_num: $ => seq($._imp_io, $._T, $._T),
    print_char: $ => seq($._imp_io, $._S, $._S),
    print_num: $ => seq($._imp_io, $._S, $._T),
    op_io: $ => choice($.read_char, $.read_num, $.print_char, $.print_num),

    add: $ => seq($._imp_arithmetic, $._S, $._S),
    sub: $ => seq($._imp_arithmetic, $._S, $._T),
    mul: $ => seq($._imp_arithmetic, $._S, $._L),
    div: $ => seq($._imp_arithmetic, $._T, $._S),
    mod: $ => seq($._imp_arithmetic, $._T, $._T),
    op_arithmetic: $ => choice($.add, $.sub, $.mul, $.div, $.mod),

    push: $ => seq($._imp_stack, $._S, field('num', $.num)),
    dup: $ => seq($._imp_stack, $._L, $._S),
    swap: $ => seq($._imp_stack, $._L, $._T),
    discard: $ => seq($._imp_stack, $._L, $._L),
    copy: $ => seq($._imp_stack, $._T, $._S, field('num', $.num)),
    slide: $ => seq($._imp_stack, $._T, $._L, field('num', $.num)),
    op_stack: $ => choice($.push, $.dup, $.swap, $.discard, $.copy, $.slide),

    store: $ => seq($._imp_heap, $._S),
    load: $ => seq($._imp_heap, $._T),
    op_heap: $ => choice($.store, $.load),

    label: $ => seq($._imp_flow, $._S, $._S, field('label_name', $.label_name)),
    call: $ => seq($._imp_flow, $._S, $._T, field('label_name', $.label_name)),
    jump: $ => seq($._imp_flow, $._S, $._L, field('label_name', $.label_name)),
    jump_zero: $ => seq($._imp_flow, $._T, $._S, field('label_name', $.label_name)),
    jump_neg: $ => seq($._imp_flow, $._T, $._T, field('label_name', $.label_name)),
    return: $ => seq($._imp_flow, $._T, $._L),
    exit: $ => seq($._imp_flow, $._L, $._L),
    op_flow: $ => choice(
      $.label,
      $.call,
      $.jump,
      $.jump_zero,
      $.jump_neg,
      $.return,
      $.exit
    ),


    label_name: $ => seq(
      repeat(choice($.S, $.T)),
      $.L
    ),
    num: $ => seq(
      field('sign', choice($._S, $._T)),
      field('value', repeat(choice($.S, $.T))),
      // repeat(choice($._S, $._T)),
      // field('value', repeat(choice('S', 'T'))),
      // token(repeat(choice('S', 'T'))),
      field('terminator', $._L),
    )
  }
});