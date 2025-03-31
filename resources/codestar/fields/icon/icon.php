<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access directly.
/**
 *
 * Field: icon
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 */
if ( ! class_exists( 'HCF_Field_icon' ) ) {
  class HCF_Field_icon extends HCF_Fields {

    public function __construct( $field, $value = '', $unique = '', $where = '', $parent = '' ) {
      parent::__construct( $field, $value, $unique, $where, $parent );
    }

    public function render() {

      $args = wp_parse_args( $this->field, array(
        'button_title' => esc_html__( 'Add Icon', 'hcf' ),
        'remove_title' => esc_html__( 'Remove Icon', 'hcf' ),
      ) );

      echo $this->field_before();

      $nonce  = wp_create_nonce( 'hcf_icon_nonce' );
      $hidden = ( empty( $this->value ) ) ? ' hidden' : '';

      echo '<div class="hcf-icon-select">';
      echo '<span class="hcf-icon-preview'. esc_attr( $hidden ) .'"><i class="'. esc_attr( $this->value ) .'"></i></span>';
      echo '<a href="#" class="button button-primary hcf-icon-add" data-nonce="'. esc_attr( $nonce ) .'">'. $args['button_title'] .'</a>';
      echo '<a href="#" class="button hcf-warning-primary hcf-icon-remove'. esc_attr( $hidden ) .'">'. $args['remove_title'] .'</a>';
      echo '<input type="hidden" name="'. esc_attr( $this->field_name() ) .'" value="'. esc_attr( $this->value ) .'" class="hcf-icon-value"'. $this->field_attributes() .' />';
      echo '</div>';

      echo $this->field_after();

    }

    public function enqueue() {
      add_action( 'admin_footer', array( 'HCF_Field_icon', 'add_footer_modal_icon' ) );
      add_action( 'customize_controls_print_footer_scripts', array( 'HCF_Field_icon', 'add_footer_modal_icon' ) );
    }

    public static function add_footer_modal_icon() {
    ?>
      <div id="hcf-modal-icon" class="hcf-modal hcf-modal-icon hidden">
        <div class="hcf-modal-table">
          <div class="hcf-modal-table-cell">
            <div class="hcf-modal-overlay"></div>
            <div class="hcf-modal-inner">
              <div class="hcf-modal-title">
                <?php esc_html_e( 'Add Icon', 'hcf' ); ?>
                <div class="hcf-modal-close hcf-icon-close"></div>
              </div>
              <div class="hcf-modal-header">
                <input type="text" placeholder="<?php esc_html_e( 'Search...', 'hcf' ); ?>" class="hcf-icon-search" />
              </div>
              <div class="hcf-modal-content">
                <div class="hcf-modal-loading"><div class="hcf-loading"></div></div>
                <div class="hcf-modal-load"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <?php
    }

  }
}
