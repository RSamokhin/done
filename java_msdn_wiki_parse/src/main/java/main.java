import java.io.*;
import java.util.*;
import java.net.*;
import java.sql.SQLException;
import org.apache.commons.lang.StringUtils;
import org.json.*;

public class main{
    private static BaseConnector connector = null;
    public static void main (String[]args) throws ClassNotFoundException, SQLException, IOException {
        PrintWriter out = new PrintWriter(System.out);
        String surl = "http://technet.microsoft.com/en-us/library/ff355324.aspx"+"?toc=1";//in.nextLine()+"?toc=1";
        out.println("Home");
        connector = new BaseConnector();
        deleteData(connector,
                   "ff355324");
        insertData(connector,
                   "ff355324",
                    "Forefront Threat Management Gateway (TMG) 2010",
                    "true",
                    "",
                    "http://technet.microsoft.com/en-us/library/ff355324.aspx");
        out.flush();
        getJsonArray(surl,0);
        connector.close();
    }
    private static void insertData(BaseConnector connector, String pid,String title, String isparent, String parent, String href) throws SQLException{
        BaseStatement statement = new BaseStatement(connector);
        String[]columns = {"pid","title","isparent","parent","href"};
        String[]params = new String[5];
        params[0] = pid;
        params[1] = title;
        params[2] = isparent;
        params[3] = parent;
        params[4] = href;
        String[][]cdata = new String[0][0];
        statement.makeQuery("insert","done.done",columns,cdata,params);
    };
    private static void deleteData(BaseConnector connector,String pid) throws SQLException{
        BaseStatement statement = new BaseStatement(connector);
        String[]columns = {};
        String[]params = {};
        String[][]cdata = new String[1][3];
        cdata[0][0]="pid";
        cdata[0][1]="=";
        cdata[0][2]=pid;        
        statement.makeQuery("delete","done.done",columns,cdata,params);
    };
    private static void getJsonArray(String surl,int depth) throws MalformedURLException, IOException, SQLException{
        PrintWriter out = new PrintWriter(System.out);
        URL url = new URL(surl);
        URLConnection conn = url.openConnection();
        Scanner sFromUrl = new Scanner(conn.getInputStream());
        StringBuilder resultString = new StringBuilder();
        while(sFromUrl.hasNextLine()){
            resultString.append(sFromUrl.nextLine());
        }
        JSONArray jsonArray = new JSONArray(resultString.toString());
        depth = depth+1;
        if (depth<3)
            for(int i = 0 ; i < jsonArray.length(); i++){
                String newUrl,newTitle;
                JSONObject json =  (JSONObject) jsonArray.get(i);
                newUrl = "http://technet.microsoft.com"+(String) json.get("Href")+"?toc=1&"+Math.random();
                newTitle = (String) json.get("Title");
                for (int j = 0 ; j < depth ; j++)
                    out.print("  ");
                out.println(newTitle);    
                out.flush();
                JSONObject extendedAttributes = (JSONObject) json.get("ExtendedAttributes");
                BaseStatement statement = new BaseStatement(connector);
                deleteData(connector,
                    StringUtils.substringBetween(newUrl, "library/", ".aspx"));
                insertData(connector,
                    StringUtils.substringBetween(newUrl, "library/", ".aspx"),
                    newTitle.replaceAll("'", ""),
                    ("true".equals((String)extendedAttributes.get("data-tochassubtree")))?"true":"false",
                    StringUtils.substringBetween(surl, "library/", ".aspx"),
                    newUrl);
                if ("true".equals((String)extendedAttributes.get("data-tochassubtree")))
                        getJsonArray(newUrl,depth);
                }
    }
}