import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;
public class BaseConnector{
    private final String address =  "jdbc:postgresql://127.0.0.1:5432/done";
    private final String user = "done";
    private final String password = "Qaz12345";
    public Connection connection = null;
    public BaseConnector() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        connection = DriverManager.getConnection(
            address,
            user,
            password
        );
    }  
}
