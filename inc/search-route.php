<?php 

    add_action('rest_api_init', 'universityRegisterSearch');

    function universityRegisterSearch() {
        register_rest_route('university/v1', 'search', array(
            'methods' => WP_REST_SERVER::READABLE,
            'callback' => 'universitySearchResults'
        ));
    }

    function universitySearchResults($data) {
        $mainQuery = new WP_Query(array(
            'post_type' => array('post', 'page', 'professor', 'program', 'event'),
            's' => sanitize_text_field($data['term'])
        ));

        $results = array(
            'generalInfo' => array(),
            'professors' => array(),
            'programs' => array(),
            'events' => array()
        );

        while($mainQuery->have_posts()) {
            $mainQuery->the_post();

            if (get_post_type() == 'post') {
                array_push($results['generalInfo'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'postType' => "post",
                    'authorName' => get_the_author()
                ));
            }

            if (get_post_type() == 'page') {
                array_push($results['generalInfo'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'postType' => "page",
                ));
            }

            if (get_post_type() == 'professor') {
                array_push($results['professors'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
                ));
            }

            if (get_post_type() == 'program') {
                array_push($results['programs'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'id' => get_the_ID()
                ));
            }

            if (get_post_type() == 'event') {
                $eventDate = new DateTime(get_field('event_date'));
                array_push($results['events'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'month' => $eventDate->format('M'),
                    'day' => $eventDate->format('d'),
                    'hasExerpt'=> has_excerpt(),
                    'exerpt' => get_the_excerpt()
                ));
            }

        }
        

        if ($results['programs']) {

            $programsMetaQuery = array('relation' => 'OR');

            foreach($results['programs'] as $item) {
                array_push($programsMetaQuery,                 array(
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => '"' . $item['id'] . '"'
                ));
            }

            $programRelationshipQuery = new WP_Query(array(
                'post_type' => 'professor',
                'meta_query' => $programsMetaQuery
            ));

            while($programRelationshipQuery->have_posts()) {
                $programRelationshipQuery->the_post();
                if (get_post_type() == 'professor') {
                    array_push($results['professors'], array(
                        'title' => get_the_title(),
                        'permalink' => get_the_permalink(),
                        'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
                    ));
                }
            }
 
        }

        $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));

        return $results;

    }

?>