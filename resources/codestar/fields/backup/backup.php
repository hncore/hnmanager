<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access directly.
/**
 *
 * Field: backup
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 */
if ( ! class_exists( 'HCF_Field_backup' ) ) {
  class HCF_Field_backup extends HCF_Fields {

    public function __construct( $field, $value = '', $unique = '', $where = '', $parent = '' ) {
      parent::__construct( $field, $value, $unique, $where, $parent );
    }

    public function render() {

      $unique = $this->unique;
      $nonce  = wp_create_nonce( 'hcf_backup_nonce' );
      $export = add_query_arg( array( 'action' => 'hcf-export', 'unique' => $unique, 'nonce' => $nonce ), admin_url( 'admin-ajax.php' ) );

      echo $this->field_before();

      echo '<textarea name="hcf_import_data" class="hcf-import-data"></textarea>';
      echo '<button type="submit" class="button button-primary hcf-confirm hcf-import" data-unique="'. esc_attr( $unique ) .'" data-nonce="'. esc_attr( $nonce ) .'">'. esc_html__( 'Import', 'hcf' ) .'</button>';
      echo '<hr />';
      echo '<textarea readonly="readonly" class="hcf-export-data">'. esc_attr( json_encode( get_option( $unique ) ) ) .'</textarea>';
      echo '<a href="'. esc_url( $export ) .'" class="button button-primary hcf-export" target="_blank">'. esc_html__( 'Export & Download', 'hcf' ) .'</a>';
      echo '<hr />';
      echo '<button type="submit" name="hcf_transient[reset]" value="reset" class="button hcf-warning-primary hcf-confirm hcf-reset" data-unique="'. esc_attr( $unique ) .'" data-nonce="'. esc_attr( $nonce ) .'">'. esc_html__( 'Reset', 'hcf' ) .'</button>';

      echo $this->field_after();

    }

  }
}
