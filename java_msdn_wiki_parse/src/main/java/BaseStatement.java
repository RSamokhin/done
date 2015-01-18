import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
public class BaseStatement {
    public Statement statement = null;
    private ResultSet resultset = null;
    private String query = null;
    public BaseStatement (BaseConnector connector) throws SQLException {
       statement = connector.connection.createStatement();
    }
    private void setStatement (String stringQuery){
        query = stringQuery;
    }
    
}
