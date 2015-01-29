$myConfig = @{
    siteUrl="http://pelmen-tg-prj/PWA";

}
Add-PSSnapin Microsoft.SharePoint.PowerShell
$mySite = Get-SPSite $myConfig.siteUrl