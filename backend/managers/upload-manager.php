<?php

/**
 * Upload manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Upload_Manager extends Pika_Base_Manager {

  protected $table_name = 'uploads';
}
