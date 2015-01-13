import java.io.*;
import java.util.*;
import java.net.*;
import org.json.*;

public class main{
    public static void main (String[]args) throws IOException{
        Scanner in = new Scanner(System.in);
        PrintWriter out = new PrintWriter(System.out);
        String surl = "http://technet.microsoft.com/en-us/library/aa991542.aspx"+"?toc=1";//in.nextLine()+"?toc=1";
        out.println("Home");
        out.flush();
        getJsonArray(surl,0);   
    }
    private static void getJsonArray(String surl,int depth) throws MalformedURLException, IOException{
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
                newUrl = "http://technet.microsoft.com"+(String) json.get("Href")+"?toc=1";
                newTitle = (String) json.get("Title");
                for (int j = 0 ; j < depth ; j++)
                    out.print("  ");
                out.println(newTitle);    
                out.flush();
                JSONObject extendedAttributes = (JSONObject) json.get("ExtendedAttributes");
                if ("true".equals((String)extendedAttributes.get("data-tochassubtree")))
                        getJsonArray(newUrl,depth);
                }
    }
}

