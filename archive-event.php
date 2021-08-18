<?php 
  get_header(); 
  pageBanner(array(
    'title' => 'All Events',
    'subtitle' => 'See what is happening on campus!'
  ));
?>

  <div class="container container--narrow page-section">
    
    <?php
      while (have_posts()) {
        the_post();
        get_template_part('template-parts/content-event');
      }  
      echo paginate_links();
    ?>
    
    <hr class="section-break">

    <p>Would you like to <a href="<?php echo site_url('/past-events');?>">catch up on past events?</a></p>
    
  </div>

<?php get_footer(); ?>
