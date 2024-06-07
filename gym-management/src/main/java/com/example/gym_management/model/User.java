package com.example.gym_management.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@SecondaryTables({
    @SecondaryTable(name = "clients", pkJoinColumns = @PrimaryKeyJoinColumn(name = "user_id")),
    @SecondaryTable(name = "coaches", pkJoinColumns = @PrimaryKeyJoinColumn(name = "user_id"))
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String birthdate;
    private String gender;
    private String password;
    private String username;
    private String role; // can be "USER", "CLIENT", or "COACH"

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MeasurementLog> measurementLogs;

    @Column(table = "clients")
    private String membershipStatus;

    @Column(table = "clients")
    private LocalDate membershipExpiryDate;

    @Column(table = "clients")
    private Long coachId;

    @JsonIgnore
    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkoutPlan> createdWorkoutPlans;

    @ManyToOne
    @JoinColumn(name = "assigned_workout_plan_id")
    private WorkoutPlan assignedWorkoutPlan;
    
    @Transient
    private Double bmi;


    // Getters and setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<MeasurementLog> getMeasurementLogs() {
        return measurementLogs;
    }

    public void setMeasurementLogs(List<MeasurementLog> measurementLogs) {
        this.measurementLogs = measurementLogs;
    }

    public String getMembershipStatus() {
        return membershipStatus;
    }

    public void setMembershipStatus(String membershipStatus) {
        this.membershipStatus = membershipStatus;
    }

    public LocalDate getMembershipExpiryDate() {
        return membershipExpiryDate;
    }

    public void setMembershipExpiryDate(LocalDate membershipExpiryDate) {
        this.membershipExpiryDate = membershipExpiryDate;
    }

    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public List<WorkoutPlan> getCreatedWorkoutPlans() {
        return createdWorkoutPlans;
    }

    public void setCreatedWorkoutPlans(List<WorkoutPlan> createdWorkoutPlans) {
        this.createdWorkoutPlans = createdWorkoutPlans;
    }

    public WorkoutPlan getAssignedWorkoutPlan() {
        return assignedWorkoutPlan;
    }

    public void setAssignedWorkoutPlan(WorkoutPlan assignedWorkoutPlans) {
        this.assignedWorkoutPlan = assignedWorkoutPlans;
    }
    
    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }
}
