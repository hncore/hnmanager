var $ = jQuery.noConflict();

$(document).ready(function() {
    // Xử lý expand/collapse cho .expand-act-box
    $('.expand-act-box').off('click').on('click', function() {
        var collapseContentSelector = $(this).attr('id'); // Lấy ID
        var $toggleSwitch = $(this);
        var $target = $('#' + collapseContentSelector); // Thêm # vào ID để tìm phần tử

        // Kiểm tra nếu target tồn tại
        if ($target.length) {
            $target.slideToggle(500, function() {
                if ($target.is(':hidden')) {
                    $toggleSwitch.html('<i class="dashicons dashicons-unlock"></i> ' + $toggleSwitch.text().replace('dashicons-dismiss', 'dashicons-unlock'));
                } else {
                    $toggleSwitch.html('<i class="dashicons dashicons-dismiss"></i> ' + $toggleSwitch.text().replace('dashicons-unlock', 'dashicons-dismiss'));
                }

                // Cuộn đến phần tử
                $('html, body').animate({
                    scrollTop: $target.offset().top - 100
                }, 500);
            });
        }
    });

    // Xử lý click cho #update-license
    $('#update-license').off('click').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var action = $button.data('action');
        if ($button.hasClass('sending')) {
            return;
        }

        $button.addClass('sending').text('Updating...').prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: haun_license.ajax_url,
            dataType: 'json',
            data: {
                action: action,
                nonce: haun_license.nonce 
            },
            success: function(res) {
                $('.license-msg').show().text(res.message || 'Update completed').css('color', res.status ? 'green' : 'red');
            },
            error: function(xhr, status, error) {
                $('.license-msg').show().text('An error occurred while updating.').css('color', 'red');
            },
            complete: function() {
                $button.removeClass('sending').text('Update License').prop('disabled', false);
            }
        });
    });

    $('#activate-license').off('click').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var licenseKey = $('input[name="license_key"]').val();
        if ($button.hasClass('sending')) {
            return;
        }
        $button.addClass('sending').text('Activating...').prop('disabled', true);
        $.ajax({
            url: haun_license.ajax_url,
            type: 'POST',
            data: {
                action: 'haun_activate_license',
                nonce: haun_license.nonce,
                license_key: licenseKey
            },
            success: function(response) {
                if (response.status) {
                    location.reload();
                } else {
                    $button.text('Kích Hoạt').prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                $button.text('Kích Hoạt').prop('disabled', false);
            },
            complete: function() {
                $button.removeClass('sending');
            }
        });
    });

    $('#deactivate-license').off('click').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var action = $button.data('action');
        if ($button.hasClass('sending')) {
            return;
        }

        $button.addClass('sending').text('Deactivating...').prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: haun_license.ajax_url,
            dataType: 'json',
            data: {
                action: action,
                nonce: haun_license.nonce 
            },
            success: function(res) {
                if (res.status) {
                    $button.text('Deactivated');
                    $('#deactivate-status').show().text(res.message);
                    $('.license_status').addClass('license_invalid');
                    $('.license_invalid i').removeClass('dashicons-yes-alt').addClass('dashicons-dismiss');
                    $('.license_status .txt').text('Your license is invalid');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                } else {
                    $('#deactivate-status').show().text(res.message || 'Deactivation failed').css('color', 'red');
                    $button.text('Deactivate License');
                }
            },
            error: function(xhr, status, error) {
                $('#deactivate-status').show().text('An error occurred while deactivating.').css('color', 'red');
                $button.text('Deactivate License');
            },
            complete: function() {
                $button.removeClass('sending').prop('disabled', false);
            }
        });
    });
});

// Hàm kiểm tra email (giữ nguyên)
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}