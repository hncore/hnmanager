var $ = jQuery.noConflict();
$(document).ready(function() {
    const PLUpdate      = '#themes-update-license';
    const PLActivate    = '#themes-activate-license';
    const PLDeactivate  = '#themes-deactivate-license';
    const PLMsg         = '#themes-activate-status';

    $(PLUpdate).off('click').on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        const action  = $button.data('action');
        const slug    = $button.data('slug');
        if ($button.hasClass('sending')) {
            return;
        }
        $button.addClass('sending').text('Updating...').prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: hncore_license.ajax_url,
            dataType: 'json',
            data: {
                action: action,
                nonce: hncore_license.nonce,
                slug: slug
            },
            success: function(res) {
                if (res.success && res.license === 'valid') {
                    $(PLMsg).show().text(res.message || 'Update completed').css('color', 'green');
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                } else {
                    $(PLMsg).html(res.message).css({ display: 'block', color: 'red' });
                }
             },
            error: function(xhr, status, error) {
                $(PLMsg).show().text('An error occurred while updating.').css('color', 'red');
            },
            complete: function() {
                $button.removeClass('sending').text('Update License').prop('disabled', false);
            }
        });
    });

    $(PLActivate).off('click').on('click', function(e) {
        e.preventDefault();
        var $button  = $(this);
        const action  = $button.data('action');
        const slug    = $button.data('slug');
        const licenseKey = $('input[name="license_key"]').val();
        if (!licenseKey) {
            $(PLMsg).html('License key is required.').css({ display: 'block', color: 'red' });
            return;
        }
        if ($button.hasClass('sending')) {
            return;
        }
        $button.addClass('sending').text('Activating...').prop('disabled', true);
        $.ajax({
            url: hncore_license.ajax_url,
            type: 'POST',
            data: {
                action: action,
                nonce: hncore_license.nonce,
                license_key: licenseKey,
                slug: slug,
            },
            success: function(response) {
                if (response.success && response.license === 'valid') {
                    $(PLMsg).html(response.message || 'License activated successfully.').css({ display: 'block', color: 'green' });
                    setTimeout(function() {
                        location.reload(); // Reload lại trang sau khi kích hoạt thành công
                    }, 1000);
                } else {
                    var errorMsg = response.message || 'Activation failed.';
                    $(PLMsg).html(errorMsg).css({ display: 'block', color: 'red' });
                    $button.text('Activate').prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                $(PLMsg).html('An error occurred: ' + error).css({ display: 'block', color: 'red' });
                $button.text('Activate').prop('disabled', false);
            },
            complete: function() {
                $button.removeClass('sending');
            }
        });
    });
    

    $(PLDeactivate).off('click').on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        const action  = $button.data('action');
        const slug    = $button.data('slug');
        if ($button.hasClass('sending')) {
            return;
        }
        $button.addClass('sending').text('Deactivating...').prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: hncore_license.ajax_url,
            dataType: 'json',
            data: {
                action: action,
                nonce: hncore_license.nonce,
                slug: slug,
            },
            success: function(res) {
                if (res.success && res.license === 'deactivated') {
                    $button.text('Deactivated');
                    $(PLMsg).show().text('License deactivated successfully').css('color', 'green');
                    $('.license_status').addClass('license_invalid');
                    $('.license_invalid i').removeClass('dashicons-yes-alt').addClass('dashicons-dismiss');
                    $('.license_status .txt').text('Your license is invalid');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                } else {
                    var errorMsg = res.message || 'Deactivation failed';
                    $(PLMsg).show().text(errorMsg).css('color', 'red');
                    $button.text('Deactivate License');
                }
            },
            error: function(xhr, status, error) {
                $(PLMsg).show().text('An error occurred while deactivating.').css('color', 'red');
                $button.text('Deactivate License');
            },
            complete: function() {
                $button.removeClass('sending').prop('disabled', false);
            }
        });
    });
});
