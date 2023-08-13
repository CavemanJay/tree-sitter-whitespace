module.exports = grammar({
  name: 'whitespace',
  rules: {
    source_file: $ => repeat($._op),
    _op: $ => choice(
      $.op_io,
      $.op_arithmetic,
      $.op_flow,
      $.op_heap,
      $.op_stack
    ),

    S: $ => 'S',
    L: $ => 'L',
    T: $ => 'T',

    imp_io: $ => seq($.T, $.L),
    imp_stack: $ => $.S,
    imp_arithmetic: $ => seq($.T, $.S),
    imp_flow: $ => $.L,
    imp_heap: $ => seq($.T, $.T),

    read_char: $ => seq(field('imp', $.imp_io), $.T, $.S),
    read_num: $ => seq(field('imp', $.imp_io), $.T, $.T),
    print_char: $ => seq(field('imp', $.imp_io), $.S, $.S),
    print_num: $ => seq(field('imp', $.imp_io), $.S, $.T),
    op_io: $ => choice($.read_char, $.read_num, $.print_char, $.print_num),

    add: $ => seq(field('imp', $.imp_arithmetic), $.S, $.S),
    sub: $ => seq(field('imp', $.imp_arithmetic), $.S, $.T),
    mul: $ => seq(field('imp', $.imp_arithmetic), $.S, $.L),
    div: $ => seq(field('imp', $.imp_arithmetic), $.T, $.S),
    mod: $ => seq(field('imp', $.imp_arithmetic), $.T, $.T),
    op_arithmetic: $ => choice($.add, $.sub, $.mul, $.div, $.mod),

    push: $ => seq(field('imp', $.imp_stack), $.S, $.num),
    dup: $ => seq(field('imp', $.imp_stack), $.L, $.S),
    swap: $ => seq(field('imp', $.imp_stack), $.L, $.T),
    discard: $ => seq(field('imp', $.imp_stack), $.L, $.L),
    copy: $ => seq(field('imp', $.imp_stack), $.T, $.S, $.num),
    slide: $ => seq(field('imp', $.imp_stack), $.T, $.L, $.num),
    op_stack: $ => choice($.push, $.dup, $.swap, $.discard, $.copy, $.slide),

    store: $ => seq(field('imp', $.imp_heap), $.S),
    load: $ => seq(field('imp', $.imp_heap), $.L),
    op_heap: $ => choice($.store, $.load),

    label: $ => seq(field('imp', $.imp_flow), $.S, $.S, $.label_name),
    call: $ => seq(field('imp', $.imp_flow), $.S, $.T, $.label_name),
    jump: $ => seq(field('imp', $.imp_flow), $.S, $.L, $.label_name),
    jump_zero: $ => seq(field('imp', $.imp_flow), $.T, $.S, $.label_name),
    jump_neg: $ => seq(field('imp', $.imp_flow), $.T, $.T, $.label_name),
    return: $ => seq(field('imp', $.imp_flow), $.T, $.L),
    exit: $ => seq(field('imp', $.imp_flow), $.L, $.L),
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
      field('sign', choice($.S, $.T)),
      field('value', repeat(choice($.S, $.T))),
      // repeat(choice($.S, $.T)),
      // field('value', repeat(choice('S', 'T'))),
      // token(repeat(choice('S', 'T'))),
      field('terminator', $.L),
    )
  }
});