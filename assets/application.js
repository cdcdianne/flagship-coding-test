// Put your application javascript here

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
