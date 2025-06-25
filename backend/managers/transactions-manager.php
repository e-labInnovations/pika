<?php

/**
 * Transactions manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Transactions_Manager extends Pika_Base_Manager {

  protected $table_name = 'transactions';
}
