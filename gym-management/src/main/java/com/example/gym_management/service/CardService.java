package com.example.gym_management.service;

import com.example.gym_management.model.Card;
import com.example.gym_management.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {
    @Autowired
    private CardRepository cardRepository;

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }

    public void deleteCard(Long id) {
        cardRepository.deleteById(id);
    }
    
    public Card updateCard(Long id, Card updatedCard) {
        return cardRepository.findById(id).map(card -> {
            card.setTitle(updatedCard.getTitle());
            card.setContent(updatedCard.getContent());
            return cardRepository.save(card);
        }).orElseThrow(() -> new RuntimeException("Card not found with id " + id));
    }
}
