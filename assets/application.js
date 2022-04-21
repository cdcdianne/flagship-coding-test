// Put your application javascript here

var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

$( function () {


    // START:: Product - Add to cart Submit button
    var frm = $('#AddToCartForm');

    frm.submit(function (e) {
        e.preventDefault();
        let cartIndex = 0;
        $.get("/cart.js", null, (data) => {
            const totalItems = data?.items?.length;

            if(totalItems){
                cartIndex=totalItems
            }

            const formData = {
                items: [
                    {
                        id: $('#productSelect').val(),
                        quantity: $('#Quantity').val(),
                        properties: {
                            cart_index: cartIndex,
                        }
    
                    }
    
                ]
            }

            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                data: formData,
                success: function (data) {
                    console.log('Submission was successful.');
                    window.location.href="/cart"
                },
                error: function (data) {
                    console.log('An error occurred.');
                },
            });
        }, "json" )
    });
    // END:: Product - Add to Cart Submit Button


    // START:: Cart - Add Instructions 
    $('#addInstructionsCheckbox').change( function () {
        if($(this).is(":checked")){
            $('#orderNotes').show();
        }else{
            $('#orderNotes').hide();
            $('#orderNotes').attr("disabled", true);
        }
    })
    // END:: Cart - Add Instructions 

    
})
