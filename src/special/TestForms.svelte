<script>
  import FB from '../FB.svelte'
  import Pipe from '../Pipe.svelte'
  import Balance from '../Balance.svelte'
  import Check from '../doc/Check.svelte'
  import Text from '../doc/Text.svelte'
  import Numeric from '../doc/Numeric.svelte'
  import Table from '../util/Table.svelte'
  const sizes = ['s3', 's2', 's1', 'n', 'b1', 'b2', 'b3']
  const data = {
    author: "Gideon",
    views: 30959694,
    version: 858,
    foo: 'bar',
    baz: 'bat',
    date: '03-18-1987',
    era: 'third',
  }
</script>

<FB vert>
<FB grid={3} around>
  <FB vert>
    {#each sizes as size}
      <FB line={size}>
        <FB leaf wr={2}>{size}</FB>
        <Check lab="foo"/>
        <Check lab="bar"/>
      </FB>
      <FB line={size}>
        <FB leaf wr={2}/>
        <span>what are the roots that clutch</span>
      </FB>
    {/each}
  </FB>
  <FB vert>
    {#each sizes as size}
      <FB line={size}>
        <FB leaf wr={2}>{size}</FB>
        <Text lab="foo"/>
      </FB>
      <FB line={size}>
        <FB leaf wr={2}/>
        <span>what branches grow</span>
      </FB>
    {/each}
  </FB>
  <FB vert>
    {#each sizes as size}
      <FB line={size}>
        <FB leaf wr={2}>{size}</FB>
        <FB expand/>
        <Numeric lab="xxx"/>
      </FB>
      <FB line={size}>
        <FB leaf wr={2}/>
        <span>out of this stony rubbish</span>
      </FB>
    {/each}
  </FB>
</FB>

<FB spacer="3"/>

<FB line grid={10} around>
  <Check lab="foo" just="e"/>
  <Check lab="bar" just="e"/>
  <Check lab="baz" just="e"/>
</FB>

<FB line grid={10} around>
  <Check lab="foo"/>
  <Check lab="bar"/>
  <Check lab="baz"/>
</FB>
<FB line grid={10} around>
  <Check lab="foo" just="s"/>
  <Check lab="bar" just="s"/>
  <Check lab="baz" just="s"/>
</FB>
<FB line grid={10} around>
  <Text lab="foo"/>
  <Text lab="bar"/>
  <Text lab="baz"/>
</FB>
<FB line grid={10} around>
  <Check lab="foo" just="s"/>
  <Check lab="bar" just="s"/>
  <Check lab="baz" just="s"/>
</FB>


<FB line grid={10} around>
  <Check lab="foo"/>
  <Check lab="bar"/>
  <Check lab="baz"/>
</FB>

<FB line grid={10} around>
  <Check lab="foo" just="e"/>
  <Check lab="bar" just="e"/>
  <Check lab="baz" just="e"/>

</FB>

<FB spacer="5"/>

<FB center fw={9}>
  <FB line="b6" vc fw={9}>
    <span>SON</span>
  </FB>
  <FB vert center>
    <FB line="s2" vc fw={9}>
      <span>OF</span>
    </FB>
    <div class="expander fill" style="height: 1.8rem;"></div>
  </FB>
  <FB line="b6" vc fw={9}>
    <span>MAN</span>
  </FB>
  <FB vert vc>
    <FB line="s2">
      <span>you cannot</span>
    </FB>
    <FB center zero>
      <FB line="b4" vc>
        <span>SAY</span>
      </FB>
      <FB line="s3" vc>
        <span>or</span>
      </FB>
    </FB>
  </FB>
  <FB line="b6" vc>
    <span>GUESS</span>
  </FB>
</FB>
<FB center fw={9}>
  <FB vert center zero>
    <FB line="s3" vc>
      <span>for you</span>
    </FB>
    <FB line="s3" vc end>
      <span>know</span>
    </FB>
  </FB>
  <FB line="b3" fw="6">ONLY</FB>
</FB>
<FB center fw={9}>
  <FB vert center>
    <FB line="b5" vc>
      <span>A</span>
    </FB>
    <div class="expander fill" style="height: 0.4rem;"></div>
  </FB>
  <FB line="b6" vc>
    <span>HEAP</span>
  </FB>
  <FB vert vc center zero>
      <FB line="s1" vc>
        <span>of</span>
        <Pipe/>
      </FB>
      <FB line="b5" vc>
        <span>BROKEN</span>
      </FB>
  </FB>
  <FB vert vc center zero>
      <FB line="b5" vc>
        <span>IMAGES</span>
      </FB>
      <FB line="s1" vc end>
        <span>where</span>
        <span>the</span>
        <span>sun</span>
        <span>beats</span>
      </FB>
  </FB>
</FB>
<Table {data} line="s3"/>
</FB>
