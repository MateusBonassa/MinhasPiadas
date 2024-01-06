package unoeste.fipp.silvio.webpiadas.security;

import java.io.IOException;

import javax.servlet.Filter; 
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;



import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import unoeste.fipp.silvio.webpiadas.others.tokenSave;

@Component
public class AccessFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        String token = tokenSave.token; 
        if(token!=null && JWTTokenProvider.verifyToken(token))
            chain.doFilter(request, response);    
        else
            response.getWriter().print("Acesso bloqueado"); 
    }
    @Bean
    public FilterRegistrationBean<AccessFilter> loggingFilter(){
        // registrando o filtro
        FilterRegistrationBean<AccessFilter> registrationBean = new FilterRegistrationBean<>();
           
        registrationBean.setFilter(new AccessFilter());
        // definindo as URLs para aplicar o filtro
        registrationBean.addUrlPatterns("/apis/cad*");
        registrationBean.addUrlPatterns("/apis/dar-curtida");   
        return registrationBean;    
    }

    
}
