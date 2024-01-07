package br.com.mateusbonassa.deploy.others;

import java.io.File;
import java.io.IOException;


import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileSaver {

    

    public String write( MultipartFile file,Long id,String titulo) {
        try {
            String path = System.getProperty("user.dir");
            String ext  = file.getOriginalFilename().replaceAll("^.*\\.(.*)$", "$1");
            path = path.replace("\\", "/");
            String complemento =  id.toString()+"_"+titulo.replace(" ", "")+"."+ext;
            path = path+"/src/main/resources/static/imagens/" +complemento;
            file.transferTo(new File(path));

            return "imagens/"+complemento;
        } catch (IllegalStateException | IOException e) {
            throw new RuntimeException(e);
        }
    }

}