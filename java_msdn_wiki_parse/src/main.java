import java.io.IOException;
import java.util.Scanner;
import java.io.PrintWriter;
import java.net.URL;
import java.net.MalformedURLException;
import java.net.URLConnection;
public class main{
    public static void main (String[]args)throws MalformedURLException, IOException{
        Scanner in = new Scanner(System.in);
        PrintWriter out = new PrintWriter(System.out);
        String surl = in.nextLine();
        URL url = new URL(surl);
        URLConnection conn = url.openConnection();
        Scanner sFromUrl = new Scanner(conn.getInputStream());
        while(sFromUrl.hasNextLine()){
            out.println(sFromUrl.nextLine());
        }
        out.flush();
    }
}