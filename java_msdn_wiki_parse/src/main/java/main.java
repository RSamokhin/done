import java.io.IOException;
import java.util.Scanner;
import java.io.PrintWriter;
import java.net.URL;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.util.HashMap;

import org.json.*;

public class main{
    public static void main (String[]args) throws IOException{
        Scanner in = new Scanner(System.in);
        String surl = in.nextLine()+"?toc=1";
        getJsonArray(surl,0,"HOME");
    }
    private static void getJsonArray(String surl,int depth,String title) throws MalformedURLException, IOException{
        PrintWriter out = new PrintWriter(System.out);
        URL url = new URL(surl);
        URLConnection conn = url.openConnection();
        Scanner sFromUrl = new Scanner(conn.getInputStream());
        StringBuilder resultString = new StringBuilder();
        while(sFromUrl.hasNextLine()){
            resultString.append(sFromUrl.nextLine());
        }
        for (int i = 0 ; i < depth ; i++)
            out.print("  ");
        out.println(title);
        try{
            JSONArray jsonArray = new JSONArray(resultString.toString());
            depth = depth+1;
            if (depth<3)
                for(int i = 0 ; i < jsonArray.length(); i++){
                    String newUrl,newTitle;
                    JSONObject json =  (JSONObject) jsonArray.get(i);
                    newUrl = "http://technet.microsoft.com"+(String) json.get("Href")+"?toc=1";
                    newTitle = (String) json.get("Title");
                    getJsonArray(newUrl,depth,newTitle);
                }
        }catch(JSONException | IOException e){}
        out.flush();
    }
}

