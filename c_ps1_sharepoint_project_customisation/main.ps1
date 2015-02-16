Add-PSSnapin Microsoft.SharePoint.PowerShell
. ".\configurationObject.ps1"
$mySite = Get-SPSite $myConfig.siteUrl;
modifyList($mySite)
function modifyList($mySite){
    . ".\getAllListsFromSite.ps1"
    getAllLists($mySite) | where "listTitle" -eq $myConfig.modifyList;
}