function getAllLists($site){
    $array = @()
    foreach ($web in $site.AllWebs) { 
        foreach ($list in $web.lists){
            $array += @{
                siteUrl="http://pelmen-tg-prj/PWA";
                webTitle = $web.Title;
                listTitle = $list.Title;
            }

        } 
    } 
    return $array
}