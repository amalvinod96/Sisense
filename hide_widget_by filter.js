//The script tries to hide a blox widget depenidn on the value of a dimension. It is based on the assumption that the dimension values are fixed and known in advance.
//  The script will need to be updated if new values are added to the dimension.
//version 1.0 Created by: Amal
// ---- JAQL Runner ----
function runJAQL(jaql) {
  let datasourceTitle = typeof jaql.datasource === 'string' 
    ? jaql.datasource 
    : jaql.datasource.title;

  let result = $.ajax({
    url: "/api/datasources/" + encodeURIComponent(datasourceTitle) + "/jaql",
    method: "POST",
    data: JSON.stringify(jaql),
    contentType: "application/json",
    dataType: "json",
    async: false
  });

  return result.responseJSON;
}

// ---- Mapping: Helm.Type value → span ID in BloX ----
let typeToSpanId = {
  'Audit': 'kpi-value',
  'Corrective Action': 'kpi-value-ca',
  'Form': 'kpi-value-fo',
  'Inspection': 'kpi-value-in',
  'Maintenance': 'kpi-value-ma',
  'Task': 'kpi-value-ta'
};

// ---- Hide/Show KPI cards based on available types ----
dashboard.on('refreshend', function (dash, ev) {

  try {
    let datasource = dash.datasource;

    const query = {
      datasource: datasource,
      metadata: [
        {
          jaql: {
            dim: "[Helm.Type_check]",
            datatype: "text",
            title: "Type_check"
          }
        }
      ]
    };

    const result = runJAQL(query);

    if (result && result.values && result.values.length > 0) {
      let helmTypes = result.values.map(function (row) {
        return row[0].data;
      });

      console.log("Helm Type Values:", helmTypes);

      // Loop through each KPI card mapping
      Object.keys(typeToSpanId).forEach(function (typeName) {
        let spanId = typeToSpanId[typeName];
        let $span = $('#' + spanId);

        if ($span.length > 0) {
          // Find the parent container (the KPI card)
          let $card = $span.closest('[class*="container"]').length > 0 
            ? $span.closest('[class*="container"]') 
            : $span.parent().parent().parent();

          if (helmTypes.includes(typeName)) {
            $card.slideDown(200);
            console.log("Showing card:", typeName);
          } else {
            $card.slideUp(200);
            console.log("Hiding card:", typeName);
          }
        }
      });

    } else {
      console.log("No Helm.Type values returned");
    }

  } catch (e) {
    console.error("JAQL Script Error:", e.message);
  }

});
