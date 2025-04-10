<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access directly.
/**
 *
 * Field: callback
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 */
if ( ! class_exists( 'HCF_Field_callback' ) ) {
  class HCF_Field_callback extends HCF_Fields {

    public function __construct( $field, $value = '', $unique = '', $where = '', $parent = '' ) {
      parent::__construct( $field, $value, $unique, $where, $parent );
    }

    public function render() {
      if ( ! isset( $this->field['function'] ) ) {
          return;
      }
      $args = isset( $this->field['args'] ) ? $this->field['args'] : null;
      try {
          $result = null; 
          if ( is_callable( $this->field['function'] ) ) {
              $result = call_user_func( $this->field['function'], $args );
          } elseif ( is_array( $this->field['function'] ) && count( $this->field['function'] ) === 2 ) {
              $class = $this->field['function'][0];
              $method = $this->field['function'][1];
              if ( is_object( $class ) && method_exists( $class, $method ) ) {
                  $result = call_user_func( [$class, $method], $args );
              }
          } elseif ( is_string( $this->field['function'] ) ) {
              if ( function_exists( $this->field['function'] ) ) {
                  $result = call_user_func( $this->field['function'], $args );
              }
          } else {
              $callback = $this->field['function'];
              if ( is_object( $callback ) && $callback instanceof Closure ) {
                  $result = call_user_func( $callback, $args );
              }
          }
          if ( $result !== null ) {
              echo $result;
          }
  
      } catch ( Exception $e ) {
          echo '<p>Error executing callback: ' . esc_html( $e->getMessage() ) . '</p>';
      }
  }

  }
}

