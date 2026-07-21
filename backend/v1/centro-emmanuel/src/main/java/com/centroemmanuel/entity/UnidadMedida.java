package com.centroemmanuel.entity;

public class UnidadMedida {
    private int idUnidadMedidad;
    private String nombreUM;
    private String abreviatura;

    public UnidadMedida(){}

    public UnidadMedida(int pIdUnidadMedida, String pNombreUM, String pAbreviatura){
        this.idUnidadMedidad = pIdUnidadMedida;
        this.nombreUM = pNombreUM;
        this.abreviatura = pAbreviatura;
    }

    //region Getters y Setters
    public int getIdUnidadMedida(){return idUnidadMedidad;}
    public void setIdUnidadMedida(int pIdUnidadMedida){this.idUnidadMedidad = pIdUnidadMedida;}

    public String getNombreUM(){return nombreUM;}
    public void setNombreUm(String pNombreUM){this.nombreUM = pNombreUM;}

    public String getAbreviatura(){return abreviatura;}
    public void setAbreviatura(String pAbreviatura){this.abreviatura = pAbreviatura;}
    //endregion
}
