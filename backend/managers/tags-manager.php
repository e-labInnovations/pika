<?php

/**
 * Tags manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Tags_Manager extends Pika_Base_Manager {

  protected $table_name = 'tags';
}
