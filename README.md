# static-shaker

Remove code from a file excluding a specific functions and their dependencies

## How it works

Given a js source file with so many things going on there. We're able to select a single identifier(function, variable or declaration) and static-shaker will remove all other code from the source except for those that contain code our specified identifier depends on.

## See it in action

Below is what happens when we want to only maintain a function called **`start`** and its dependencies

<table style="max-width:100px;margin:auto"><thead>
  <tr>
    <th style="background:black;color:white">1. Source Code -> keep start function</th>
  </tr></thead>
<tbody>
  <tr>
    <td>
        <img width="400" src="https://raw.githubusercontent.com/doc-han/static-shaker/master/statics/code.png" />
    </td>
  </tr>
</tbody>
<thead>
  <tr>
    <th style="background:black;color:white">2. Mapping dependencies</th>
  </tr></thead>
<tbody>
  <tr>
    <td>
        <img width="400" src="https://raw.githubusercontent.com/doc-han/static-shaker/master/statics/code-traced.png" />
    </td>
  </tr>
</tbody>
<thead>
  <tr>
    <th style="background:black;color:white">3. Final output with only dependencies</th>
  </tr></thead>
<tbody>
  <tr>
    <td>
        <img width="400" src="https://raw.githubusercontent.com/doc-han/static-shaker/master/statics/code-final.png" />
    </td>
  </tr>
</tbody> 
</table>

## License

static-shaker is [MIT licensed](LICENSE).
