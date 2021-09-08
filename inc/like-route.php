<?php

add_action('rest_api_init', 'universityLikeRoutes');

function universityLikeRoutes() {
  register_rest_route('university/v1', 'manageLike', array(
    'methods' => 'POST',
    'callback' => 'createLike'
  ));

  register_rest_route('university/v1', 'manageLike', array(
    'methods' => 'DELETE',
    'callback' => 'deleteLike'
  ));
}

function createLike($data) {
  if (is_user_logged_in()) {
    $professor = sanitize_text_field($data['professorId']);

    $existQuery = new WP_Query(array(
      'author' => get_current_user_ID(),
      'post_type' => 'like',
      'meta_query' => array(
        array(
          'key' => 'liked_professor_id',
          'compare' => '=',
          'value' => $professor
        )
      )
    ));

    if ($existQuery->found_posts == 0 && get_post_type($professor) == 'professor') {
      //create new like post
      return wp_insert_post(array(
        'post_type' => 'like',
        'post_status' => 'publish',
        'post_title' => 'ID Test',
        'meta_input' => array(
          'liked_professor_id' => $professor
        )
      ));
    } else {
      die('Invalid professor ID.');
    }
  } else {
    die('Only logged in users can create a like');
  }
}

function deleteLike($data) {
  $professor = sanitize_text_field($data['professorId']);

  $likePosts = new WP_Query(array(
    'post_type' => 'like',
    'meta_input' => array(
      'liked_professor_id' => $professor,
      'post_author' => get_current_user_id()
    )
  ));

  $postId = $likePosts->posts[0]->ID;

  if (get_current_user_id() == get_post_field('post_author', $postId) && get_post_type($postId) == 'like') {
    wp_delete_post($postId, false);
    return $postId . 'Like deleted.';
  } else {
    die('You do not have permission to delete that.');
  }
}
