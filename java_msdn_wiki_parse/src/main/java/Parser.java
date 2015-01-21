import java.io.*;
import java.util.*;
import java.net.*;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.lang.StringUtils;
import org.json.*;

class MyThread extends Thread{
    private static BaseConnector connector = null;
    private static String pid;
    private static String title;
    private static String isparent;
    private static String parent;
    private static String url;
    private static String surl;
   
    public MyThread(){
        this.pid =  "aa991542";
        this.title = "TechNet Library";
        this.isparent = "true";
        this.parent = "";
        this.url = "https://technet.microsoft.com/en-us/library/aa991542.aspx";
    }
    public MyThread (String newPid,String newTitle,String newIsparent,String newParent,String newUrl){
        this.pid = newPid;
        this.title = newTitle;
        this.isparent = newIsparent;
        this.parent = newParent;
        this.url = newUrl;
    }
    @Override
    public void run(){
        PrintWriter out = new PrintWriter(System.out);
        out.println(title);
        try {
            connector = new BaseConnector();
            deleteData(connector,
                       pid);
            insertData(connector,
                       pid,
                       title,
                       isparent,
                       parent,
                       url);
            out.flush();
            getJsonArray(url,0);
            connector.close();
        } catch (ClassNotFoundException | SQLException | IOException ex) {
            Logger.getLogger(MyThread.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        URL murl = new URL(surl+"?toc=1&"+Math.random());
        URLConnection conn = murl.openConnection();
        Scanner sFromUrl = new Scanner(conn.getInputStream());
        StringBuilder resultString = new StringBuilder();
        while(sFromUrl.hasNextLine()){
            resultString.append(sFromUrl.nextLine());
        }
        if (resultString.length()>0){
            JSONArray jsonArray = new JSONArray(resultString.toString());
            depth = depth+1;
            for(int i = 0 ; i < jsonArray.length(); i++){
                String newUrl,newTitle;
                JSONObject json = null;
                json =  (JSONObject) jsonArray.get(i);
                newUrl = (String) json.get("Href");
                newTitle = (String) json.get("Title");
                for (int j = 0 ; j < depth ; j++)
                    out.print("  ");
                out.println(newTitle);   
                out.flush();
                JSONObject extendedAttributes = (JSONObject) json.get("ExtendedAttributes");
                String newPid = StringUtils.substringBetween(newUrl, "library/", ".aspx"),
                       newMyTitle = newTitle.replaceAll("'", ""), 
                       newIsparent = ("true".equals((String)extendedAttributes.get("data-tochassubtree")))?"true":"false",
                       newParent = StringUtils.substringBetween(surl, "library/", ".aspx");
                if((Thread.activeCount()>20)&&(newIsparent.equals("true"))){
                    MyThread p = new MyThread(newPid, newMyTitle, newIsparent, newParent, newUrl);
                    p.start();
                }else{
                    BaseStatement statement = new BaseStatement(connector);
                    deleteData(connector,
                               newPid
                    );
                    insertData( connector,
                                newPid,
                                newMyTitle,
                                newIsparent,
                                newParent,
                                newUrl 
                    );
                    if ("true".equals((String)extendedAttributes.get("data-tochassubtree")))
                            getJsonArray(newUrl,depth);
                    }
                }
        }
    }
}
public class Parser{
    public static void main (String[]args) throws ClassNotFoundException, SQLException, IOException {
        MyThread t = new MyThread();
        t.start();
    }
} 