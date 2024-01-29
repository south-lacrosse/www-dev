# WP_List_Table Class

`WP_List_Table` is used by WordPress to display admin tables for posts, pages, plugins etc., and we use it as well to keep everything looking consistent.

Originally WordPress wanted it to only be used internally, but it is used by many, many plugins, so they eventually bowed to the inevitable and made it public, committing to maintaining backwards compatibility.

However, this does mean the documentation is pretty sparse, so here are useful insights we have learned.

Basic usage is to create your own sub-class as follows:

```php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}
class My_List_Table extends \WP_List_Table {
    private static $list_table;
    /**
     * Called when the admin page containing this list table is loaded
     */
    public static function load() {
        if (!current_user_can('capability')) {
            wp_die('You do not have sufficient permissions to access this page.');
        }
        self::$list_table = new My_List_Table();
        add_action( 'admin_head', function() {
            echo '<style>.fixed .column-one{width:25%}</style>';
        });
        get_current_screen()->add_help_tab( [
            'id'      => 'overview',
            'title'   => 'Overview',
            'content' => '<p>My page help.</p>',
        ] );
    }

    /**
     * Menu page callback to render output
     */
    public static function render_page() {
        self::$list_table->prepare_items();
        ?>
<div class="wrap">
    <h1>Page Title</h1>
    <form method="post">
<?php
        if ( isset( $_REQUEST['s'] ) && strlen( $_REQUEST['s'] ) ) {
            echo ' <span class="subtitle">Search results for &#8220;' . $_REQUEST['s'] . '&#8221;</span>';
        }
        self::$list_table->search_box('search', 'search_id');
        self::$list_table->display();
    ?>
    </form>
</div>
<?php
    }

    public function __construct() {
        parent::__construct([
            'singular' => 'list_name',
            'plural'   => 'list_names'
        ] );
    }
    ...
}
```

And then connect it using:

```php
add_action('admin_menu', function() {
    $hook_suffix = add_menu_page('Page Title', 'Menu Title', 'activate_plugins', 'menu_slug',
        [My_List_Table::class, 'render_page'], 'dashicons-shield-alt', 30);
    add_action( 'load-' . $hook_suffix, [My_List_Table::class, 'load'] );
}
```

The `WP_List_Table` class isn't loaded automatically, so you need to include it in your sub-class.

The `load` method will be called when the page containing the list table is loaded. Here you can add any styles, scripts, or help tabs you need.

You can also put actions or bulk actions here. Remember to use nonces and check capabilities.

The list table should also be created here as that allows it to populate the screen options tab.

List tables are designed to work on a single menu/submenu page, so you shouldn't use it on a tab, though it's probably doable if you have a single list table per submenu.

The `render_page` method above then prepares and displays the list table.

You could off course put the `load` and `render_page` methods in another class, but it makes sense to make them static methods on your list table.

## Class Methods To Override

You customise your list table by overriding its methods.

`public function get_columns()` - return array of columns in the format `'name' => 'title'`. If you want a checkbox for bulk actions in the first column then name it `cb`, as the list table will then handle it appropriately.

`protected function get_sortable_columns()` - return an array of sortable columns (defaults to empty array). Entries may be `'column_slug' => 'orderby'`, or `'column_slug' => [ 'orderby', true ]`  to order descending. See the method in `WP_List_Table` for a full description.

`protected function column_default( $item, $column_name )` - return the default column value, e.g. `return $item->$column_name;`.

`public function column_{$column_name}( $item )` - custom column contents, if required.

`public function _column_{$column_name}( $item, $classes, $data, $primary )` - custom column contents, but provides the complete table cell HTML. This allows you to return a `<th>` instead of the default `<td>`. You should add `$attributes = "class='$classes' $data";` to the table cell tag, and add any row actions if needed.

`protected function get_bulk_actions()` - return bulk actions array `'slug' => 'action'`. Make sure you create a checkbox column.

`protected function get_table_classes()` - the default implementation adds classes for posts, so it's best to override with `return [ 'widefat', 'fixed', 'striped', $this->_args['plural'] ];`.

`public function no_items()` - default is 'No items found.'

`public function display()` - override if you need to add extra HTML. Don't forget to call `parent::display();`.

`public function single_row( $item )` - how a single row is displayed, override to change the `tr` tag.

`function extra_tablenav( $which )` - display extra controls between bulk actions and pagination.

`protected function display_tablenav( $which )` - used to display the top and bottom navigation. If you are displaying all the items without paging or bulk actions, then override to just `return;`.

`protected function get_views()` - use to add views to your list table, e.g. the `All | Published | Private` views on the Posts page. You can use the built in method to `return $this->get_views_links( $links );` for any array of links with items `url`, `link`, `current`. Call `$list_table->views();` after the page title and before the form to display, and filter your data in your `prepare` method.

## Row Actions

Actions (e.g `Edit | Quick Edit | Delete`) should be added by overriding `handle_row_actions`, which is called for each cell after the `column_...` method, except for the `cb` column, or if a `_column_{$column_name}` method is defined (note the underscore).

Note that row actions behave like the standard WordPress ones, so appear below the cell contents, and are hidden until they are moused over.

```php
protected function handle_row_actions( $item, $column_name, $primary ) {
    if ( $primary !== $column_name ) {
        return '';
    }
    $team = urlencode($item->team);
    $actions = [
        'edit' => '<a href="?page=semla_teams&action=edit&team=' . $team
            . '" data-team="' . $team . '" title="Edit">Edit</a>',
        'delete' => '<a href="?page=semla_teams&action=delete&team=' . $team . $this->nonce
            . '" class="submitdelete" data-team="' . $team . '" title="Delete">Delete</a>',
    ];
    return $this->row_actions( $actions ) ;
}
```

## Checkbox Column

As noted above, to have a checkbox column for bulk actions make sure you add a column named `cb` (any title), and a method like:

```php
public function column_cb( $item ) {
    return '<input type="checkbox" name="column_names[]" value="' . urlencode($item->column_name). '" />';
}
```

The WP_List_Table will then style the column appropriately, and add a "select all" checkbox in the table header and footer.

## Preparing

Before displaying you need to load the items to display, and set the pagination information.

The WordPress core list tables have a way to populate the column headers, but for custom list tables you need to pre-load `$this->_column_headers`. It's important to set the primary column as it is used in various places, including what to display when the table switches to responsive mode for small screens.

```php
public function prepare_items() {
    $this->_column_headers = [ $this->get_columns(), get_hidden_columns( $this->screen ),
         $this->get_sortable_columns(), 'primary_column' ];
    // extract order,orderby etc if needed
    $current_page = $this->get_pagenum();
    $this->items = ...
    $this->set_pagination_args( [
        'total_items' => ...,
        'per_page' => ...
    ] );
}
```

### Hidden Columns

By default the list table adds a "Screen Options" tab to allow users to hide columns, and that will be remembered on page reload. To make sure this functionality works you must set the hidden columns when you populate `_column_headers` by calling `get_hidden_columns`, and the list table must be instantiated before the screen options are created (which is why we create it in the `load` method above).

If you want to stop a column from being hidden then you can name it one of 'cb', 'comment', 'media', 'name', 'title', 'username', 'blogname'.

If you do not want users to be able to hide any columns then set the 2nd item in the `_column_headers` to an empty array, and stop "Screen Options" being displayed by either creating your list table after the screen options are rendered (so in your `render_page` method), or add the following filter:

```php
add_filter('screen_options_show_screen', '__return_false' );
```
