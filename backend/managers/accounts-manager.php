<?php

/**
 * Accounts manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Accounts_Manager extends Pika_Base_Manager {

  protected $table_name = 'accounts';
}
